"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  addManagerMember,
  clearAddMemberStatus,
  fetchManagerMembers,
} from "@/store/slices/managerMemberSlice";

const initialForm = {
  name: "",
  email: "",
  phnNumber: "",
};

export default function AddMemberDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { addMemberLoading, addMemberError, addMemberSuccess } = useSelector(
    (state) => state.messMember
  );
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        addManagerMember({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phnNumber: formData.phnNumber.trim(),
        })
      ).unwrap();

      dispatch(fetchManagerMembers());
      setFormData(initialForm);
      onClose();
    } catch {
      // Error is displayed from redux state.
    }
  };

  const handleClose = () => {
    dispatch(clearAddMemberStatus());
    setFormData(initialForm);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      dispatch(clearAddMemberStatus());
    }
  }, [dispatch, isOpen]);

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-30 bg-[#102a4360] transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-40 h-full w-full max-w-md border-l border-[#102a431a] bg-[var(--color-paper)] p-6 shadow-2xl transition-transform duration-300 ease-out md:p-8 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)]">Add Member</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Fill up the required fields to add a consumer.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[#102a4325] text-[var(--color-muted)] transition hover:bg-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={addMemberLoading}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
              placeholder="Enter full name"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={addMemberLoading}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
              placeholder="Enter email"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-[var(--color-muted)]">Phone</span>
            <input
              type="tel"
              name="phnNumber"
              value={formData.phnNumber}
              onChange={handleChange}
              disabled={addMemberLoading}
              required
              className="w-full rounded-xl border border-[#102a4325] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-brand)]"
              placeholder="01XXXXXXXXX"
            />
          </label>

          {addMemberError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {addMemberError}
            </p>
          ) : null}

          {addMemberSuccess ? (
            <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {addMemberSuccess}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={addMemberLoading}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[var(--color-brand)] px-4 py-3 font-semibold text-white transition hover:bg-[var(--color-brand-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {addMemberLoading ? "Adding..." : "Add Member"}
          </button>
        </form>
      </aside>
    </>
  );
}
