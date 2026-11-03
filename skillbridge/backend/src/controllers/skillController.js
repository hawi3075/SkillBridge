/**
 * Skill & Category Management Controller
 */

const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

// 1. Categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await db.skillCategory.findMany({
      include: { skills: true }
    });
    return successResponse(res, categories, 'Categories fetched successfully');
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return errorResponse(res, 'Category name is required', 400);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await db.skillCategory.create({
      data: { name, slug, description, icon: icon || 'Code' }
    });
    return successResponse(res, category, 'Category created', 201);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;
    const category = await db.skillCategory.update({
      where: { id },
      data: {
        ...(name && { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }),
        ...(description !== undefined && { description }),
        ...(icon && { icon })
      }
    });
    return successResponse(res, category, 'Category updated');
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.skillCategory.delete({ where: { id } });
    return successResponse(res, null, 'Category deleted');
  } catch (err) {
    next(err);
  }
};

// 2. Skills
const getAllSkills = async (req, res, next) => {
  try {
    const { category, search, difficulty } = req.query;
    let skills = await db.skill.findMany({
      include: {
        category: true,
        offeredBy: true,
        wantedBy: true
      }
    });

    if (category) {
      skills = skills.filter(s => s.categoryId === category || s.category?.slug === category);
    }
    if (difficulty) {
      skills = skills.filter(s => s.difficulty === difficulty);
    }
    if (search) {
      const q = search.toLowerCase();
      skills = skills.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }

    // Attach count of active mentors/students
    const enriched = skills.map(s => ({
      ...s,
      offeredCount: (s.offeredBy || []).length,
      wantedCount: (s.wantedBy || []).length
    }));

    return successResponse(res, enriched, 'Skills fetched successfully');
  } catch (err) {
    next(err);
  }
};

const getSkillBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const skill = await db.skill.findUnique({
      where: { slug },
      include: {
        category: true,
        offeredBy: {
          include: {
            user: { include: { profile: true } }
          }
        },
        wantedBy: {
          include: {
            user: { include: { profile: true } }
          }
        }
      }
    });

    if (!skill) {
      return errorResponse(res, 'Skill not found', 404);
    }

    return successResponse(res, skill, 'Skill retrieved');
  } catch (err) {
    next(err);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const { name, description, categoryId, icon, difficulty } = req.body;
    if (!name || !categoryId || !description) {
      return errorResponse(res, 'Name, categoryId, and description are required', 400);
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const skill = await db.skill.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        icon: icon || 'BookOpen',
        difficulty: difficulty || 'INTERMEDIATE'
      },
      include: { category: true }
    });

    return successResponse(res, skill, 'Skill created successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, icon, difficulty } = req.body;

    const skill = await db.skill.update({
      where: { id },
      data: {
        ...(name && { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }),
        ...(description && { description }),
        ...(categoryId && { categoryId }),
        ...(icon && { icon }),
        ...(difficulty && { difficulty })
      },
      include: { category: true }
    });

    return successResponse(res, skill, 'Skill updated');
  } catch (err) {
    next(err);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.skill.delete({ where: { id } });
    return successResponse(res, null, 'Skill deleted');
  } catch (err) {
    next(err);
  }
};

// 3. User Offered & Wanted Skills
const getUserSkills = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const offered = await db.userOfferedSkill.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } }
    });
    const wanted = await db.userWantedSkill.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } }
    });

    return successResponse(res, { offered, wanted }, 'User skills fetched');
  } catch (err) {
    next(err);
  }
};

const addOfferedSkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { skillId, proficiencyLevel, yearsOfExperience, description } = req.body;

    if (!skillId) return errorResponse(res, 'skillId is required', 400);

    const record = await db.userOfferedSkill.create({
      data: {
        userId,
        skillId,
        proficiencyLevel: proficiencyLevel || 'INTERMEDIATE',
        yearsOfExperience: parseInt(yearsOfExperience) || 1,
        description: description || ''
      },
      include: { skill: true }
    });

    return successResponse(res, record, 'Skill added to teaching profile', 201);
  } catch (err) {
    next(err);
  }
};

const removeOfferedSkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { skillId } = req.params;

    await db.userOfferedSkill.delete({
      where: {
        userId_skillId: { userId, skillId }
      }
    });

    return successResponse(res, null, 'Offered skill removed');
  } catch (err) {
    next(err);
  }
};

const addWantedSkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { skillId, priority, goals } = req.body;

    if (!skillId) return errorResponse(res, 'skillId is required', 400);

    const record = await db.userWantedSkill.create({
      data: {
        userId,
        skillId,
        priority: priority || 'MEDIUM',
        goals: goals || ''
      },
      include: { skill: true }
    });

    return successResponse(res, record, 'Skill added to learning wishlist', 201);
  } catch (err) {
    next(err);
  }
};

const removeWantedSkill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { skillId } = req.params;

    await db.userWantedSkill.delete({
      where: {
        userId_skillId: { userId, skillId }
      }
    });

    return successResponse(res, null, 'Wanted skill removed');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSkills,
  getSkillBySlug,
  createSkill,
  updateSkill,
  deleteSkill,
  getUserSkills,
  addOfferedSkill,
  removeOfferedSkill,
  addWantedSkill,
  removeWantedSkill
};
