import React, { useState } from 'react';
import Modal from '../common/Modal';
import { exchangeApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Send, ArrowRightLeft } from 'lucide-react';

export const ProposeExchangeModal = ({ isOpen, onClose, candidate, initialMatch = null, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const myOfferedSkills = user?.offeredSkills || [];
  const candidateOfferedSkills = candidate?.offeredSkills || [];

  const [offeredSkillId, setOfferedSkillId] = useState(
    initialMatch?.matchedOfferedSkill?.id || (myOfferedSkills[0]?.skillId || '')
  );
  const [wantedSkillId, setWantedSkillId] = useState(
    initialMatch?.matchedWantedSkill?.id || (candidateOfferedSkills[0]?.skillId || '')
  );
  const [message, setMessage] = useState(
    `Hi ${candidate?.profile?.fullName || candidate?.username}! I'd love to exchange skills with you. Let's connect and schedule a session.`
  );
  const [proposedSchedule, setProposedSchedule] = useState('Weekdays after 6:00 PM');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkillId || !wantedSkillId) {
      showToast('Please select both a skill to teach and a skill to learn', 'error');
      return;
    }
    if (!message.trim() || message.length < 10) {
      showToast('Please provide a short introductory message (at least 10 characters)', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await exchangeApi.sendRequest({
        receiverId: candidate.id,
        offeredSkillId,
        wantedSkillId,
        message: message.trim(),
        proposedSchedule: proposedSchedule.trim()
      });

      if (res.success) {
        showToast('Exchange proposal sent successfully!', 'success');
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to send proposal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Propose Skill Exchange with ${candidate?.profile?.fullName || candidate?.username}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label small fw-semibold text-dark">
            What will YOU teach {candidate?.profile?.fullName || candidate?.username}?
          </label>
          {myOfferedSkills.length > 0 ? (
            <select
              className="form-select"
              value={offeredSkillId}
              onChange={(e) => setOfferedSkillId(e.target.value)}
              required
            >
              {myOfferedSkills.map((os) => (
                <option key={os.skillId} value={os.skillId}>
                  {os.skill?.name || 'Skill'} ({os.proficiencyLevel || 'Proficient'})
                </option>
              ))}
            </select>
          ) : (
            <div className="alert alert-warning small p-2 mb-0">
              You haven't listed any skills you can teach yet. Go to your Profile to add skills!
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold text-dark">
            What do you want THEM to teach you in return?
          </label>
          {candidateOfferedSkills.length > 0 ? (
            <select
              className="form-select"
              value={wantedSkillId}
              onChange={(e) => setWantedSkillId(e.target.value)}
              required
            >
              {candidateOfferedSkills.map((cos) => (
                <option key={cos.skillId} value={cos.skillId}>
                  {cos.skill?.name || 'Skill'} ({cos.proficiencyLevel || 'Proficient'})
                </option>
              ))}
            </select>
          ) : (
            <div className="alert alert-info small p-2 mb-0">
              No specific offered skills listed. A general peer consultation will be proposed.
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold text-dark">Introduction & Goals</label>
          <textarea
            className="form-control"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself and explain what you want to achieve..."
            required
            minLength={10}
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold text-dark">Proposed Schedule / Availability</label>
          <input
            type="text"
            className="form-control"
            value={proposedSchedule}
            onChange={(e) => setProposedSchedule(e.target.value)}
            placeholder="e.g. Saturdays 10 AM - 12 PM or Weekday evenings"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-light" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={submitting}>
            <Send size={16} />
            <span>{submitting ? 'Sending...' : 'Send Exchange Proposal'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProposeExchangeModal;
