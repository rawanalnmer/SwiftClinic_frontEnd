"use client";

import { useParams, useRouter } from "next/navigation";
import { useDoctor, useDoctorSchedule } from "@/src/hooks/doctors.hook";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function DoctorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: doctor, isLoading, error } = useDoctor(id);
  const { data: schedule } = useDoctorSchedule(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Loading...
      </div>
    );

  if (error || !doctor)
    return (
      <div className="flex items-center justify-center h-64 text-destructive text-sm">
        Doctor not found.
      </div>
    );

  const initials = doctor.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Back */}
      <div className="flex justify-between mb-5 items-center">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-5"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Doctors
      </button>
      <button
      onClick={() => router.push(`/doctors/${doctor._id}/book`)}
      className="w-[155px] py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition mt-1"
      >
      Book Appointment
      </button>
      </div>
 
      <div className="grid grid-cols-1 gap-4">
        {/* Right */}
        <div className="flex flex-col gap-4">
        {/* Personal Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-md font-bold text-primary tracking-wide mb-4">
            Personal Info
          </p>
          <div className="flex items-end ">
            {/* Avatar + Col 1 */}
            <div className="grid grid-cols-2">
              <div className="grid grid-cols-2 gap-4 items-center">
                {doctor.profileImage ? (
                  <img
                    src={`http://localhost:80/uploads/${doctor.profileImage}`}
                    alt={doctor.fullName}
                    className="w-50 h-50 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-50 h-50  rounded-full bg-secondary flex items-center justify-center text-2xl font-medium text-secondary-foreground border-2 border-border">
                    {initials}
                  </div>
                )}
     

              {/* Col 1 */}
              <div className=" gap-2 mb-5 ">
                {[
                  { label: "Full Name:", value: doctor.fullName },
                  { label: "Email:", value: doctor.email },
                  { label: "Age:", value: doctor.age ? `${doctor.age} years` : "—" },
                ].map((item, i) => (
                  <div className="flex items-end gap-2 mb-5" key={i}>
                    <p className="text-sm text-foreground font-semibold">{item.label}</p>
                    <p className="text-sm text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Col 2 */}
            <div className="mb-5">
              {[
                { label: "Doctor ID:", value: doctor._id.slice(-5).toUpperCase(), mono: true },
                { label: "Phone:", value: doctor.phone },
              ].map((item, i) => (
                <div className="flex gap-2 mb-6" key={i}>
                  <p className="text-sm text-foreground font-semibold">{item.label}</p>
                  <p className={`text-sm text-foreground ${item.mono ? "font-mono" : ""}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Education */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-md font-bold text-primary  tracking-wide mb-4">
              Education
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "University:", value: doctor.university ?? "—" },
                {
                  label: "Graduation Year:",
                  value: doctor.graduationYear ?? "—",
                },
                {
                  label: "Years of Experience:",
                  value: doctor.yearsOfExperience
                    ? `${doctor.yearsOfExperience} years`
                    : "—",
                },
                {
                  label: "Certificate:",
                  value: doctor.certificateImage ? null : "—",
                  link: doctor.certificateImage
                    ? `http://localhost:80/uploads/${doctor.certificateImage}`
                    : null,
                },
              ].map((item, i) => (
                <div  className="flex gap-2" key={i}>
                  <p className="text-sm text-foreground font-semibold">
                    {item.label}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline hover:opacity-80 transition"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-md font-bold text-primary  tracking-wide mb-4">
              Working Information
            </p>
            <div className="grid grid-cols-2 mb-5 gap-5">
              <div className="flex gap-2">
                <p className="text-sm text-foreground font-semibold">
                  Location:
                </p>
                <p className="text-sm text-foreground">
                  {doctor.clinicLocationText ?? "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-foreground font-semibold">
                  Map Link:
                </p>
                {doctor.clinicLocationUrl ? (
                  <a
                    href={doctor.clinicLocationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View on Maps →
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((day) => {
                const working = schedule?.workingDays.find(
                  (d) => d.day === day && d.isActive,
                );
                return (
                  <div
                    key={day}
                    className={`rounded-lg p-2.5 text-center border transition ${
                      working
                        ? "border-primary bg-secondary"
                        : "border-border bg-muted"
                    }`}
                  >
                    <p
                      className={`text-xs font-medium capitalize ${working ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {day.slice(0, 3)}
                    </p>
                    <p
                      className={`text-xs mt-1 ${working ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {working
                        ? `${working.startTime} - ${working.endTime}`
                        : "Off"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
