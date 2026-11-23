import { WorkingDay } from "./doctors"

export interface Schedule {
  _id?: string
  doctorId: string
  workingDays: WorkingDay[]
}

export interface CreateScheduleDto {
  workingDays: WorkingDay[]
}