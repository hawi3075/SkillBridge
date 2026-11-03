import React, { useState } from 'react';
import Modal from '../common/Modal';
import { sessionApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Video } from 'lucide-react';

export const ScheduleSessionModal = ({ isOpen, onClose, exchange, onSuccess }) => {
  const { showToast } = useToast();

  // Default to tomorrow at 18:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0);
  const defaultStartTime = tomorrow.toISOString().slice(0, 16);

  const [title, setTitle] = useState(
    exchange ? `Skill Exchange: ${exchange.offeredSkill?.name || 'Topic'} & ${exchange.wantedSkill?.name || 'Topic'}` : 'Learning Session'
  );
  const [description, setDescription] = useState('Hands-on peer tutoring and interactive review.');
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [duration, setDuration] = useState('60');
  const [meetingLink, setMeetingLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !startTime) {
      showToast('Title and start time are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await sessionApi.createSession({
        exchangeId: exchange.id,
        title: title.trim(),
        description: description.trim(),
        startTime: new Date(startTime).toISOString(),
        duration: parseInt(duration),
        meetingLink: meetingLink.trim() || undefined
      });

      if (res.success) {
        showToast('Session scheduled successfully!', 'success');
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to schedule session', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Learning Session"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label small fw-semibold text-dark">Session Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-semibold text-dark">Description & Agenda</label>
          <textarea
            className="form-control"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will you cover in this session?"
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <label className="form-label small fw-semibold text-dark">Date & Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="col-md-5">
            <label className="form-label small fw-semibold text-dark">Duration</label>
            <select
              className="form-select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-semibold text-dark">
            Custom Meeting Link <span className="text-muted fw-normal">(Optional)</span>
          </label>
          <input
            type="url"
            className="form-control"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Leave blank for automatic secure Jitsi Meet room"
          />
          <div className="form-text small" style={{ fontSize: '0.78rem' }}>
            If left blank, SkillBridge will generate an instant video meeting room link for you and your peer.
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-light" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-2" disabled={submitting}>
            <Calendar size={16} />
            <span>{submitting ? 'Confirming...' : 'Schedule Session'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleSessionModal;
