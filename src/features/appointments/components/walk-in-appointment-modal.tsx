
"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalContent, ModalFooter, Button, Select, Input } from "@/src/shared/components/ui";
import { UserPlus, Calendar, Phone, Clock, User, Stethoscope } from "lucide-react";
import { DOCTORS, APPOINTMENT_TYPES } from "@/src/shared/constants";
import { appointmentsService } from "@/src/features/appointments/services/appointments-service";

interface WalkInAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}

export function WalkInAppointmentModal({
    isOpen,
    onClose,
    onSuccess
}: WalkInAppointmentModalProps) {
    const [patientName, setPatientName] = useState("");
    const [phone, setPhone] = useState("");
    const [doctor, setDoctor] = useState(DOCTORS[0].value);
    const [type, setType] = useState(APPOINTMENT_TYPES[0].value);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!patientName || !phone) {
            alert("Please fill in patient name and phone number");
            return;
        }

        setIsSubmitting(true);
        try {
            // Create a walk-in appointment for RIGHT NOW
            const now = new Date();
            await appointmentsService.createAppointment({
                patientName,
                phone,
                doctor,
                type,
                date: now.toISOString(),
                status: "confirmed", // Default to confirmed as they are physically there
                notes: "Walk-in patient (No previous lead record)"
            });

            await onSuccess();
            onClose();
            // Reset form
            setPatientName("");
            setPhone("");
        } catch (error) {
            console.error("Error creating walk-in appointment:", error);
            alert("Failed to create appointment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                        <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Quick Walk-in</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Register patient who just arrived</p>
                    </div>
                </div>
            </ModalHeader>

            <ModalContent>
                <div className="space-y-5 py-2">
                    {/* Patient Banner */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm font-bold">
                            {patientName ? patientName[0].toUpperCase() : "?"}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest leading-none mb-1">Clinic Arrival</p>
                            <p className="text-sm font-semibold text-slate-700">Instant registration for {patientName || "New Patient"}</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Patient Name</label>
                            <Input
                                placeholder="Full Name"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                icon={<User className="w-4 h-4 text-slate-400" />}
                                className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <Input
                                placeholder="077XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                icon={<Phone className="w-4 h-4 text-slate-400" />}
                                className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Doctor</label>
                                <Select
                                    value={doctor}
                                    onChange={(e) => setDoctor(e.target.value as any)}
                                    options={DOCTORS}
                                    className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all font-semibold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Service Type</label>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    options={APPOINTMENT_TYPES}
                                    className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3 mt-2">
                        <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            This appointment will be set to <span className="text-emerald-600 font-bold uppercase">Confirmed</span> for today at the current time.
                        </p>
                    </div>
                </div>
            </ModalContent>

            <ModalFooter className="border-t border-slate-50 pt-4">
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all px-6"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95 transition-all px-8 font-bold"
                >
                    Confirm Walk-in
                </Button>
            </ModalFooter>
        </Modal>
    );
}
