import mongoose, { Document, Schema } from "mongoose";

export interface IJobApplication extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  hearAbout: string;
  whyApply: string;
  musicGenres: string;
  threeAlbums?: string;
  barExperience: string;
  cocktailExperience?: string;
  craftBeerWine?: string;
  busyRush: string;
  difficultFeedback: string;
  availability: string;
  howSoonStart: string;
  anythingElse?: string;
  resume: Buffer;
  resumeContentType: string;
  submittedAt: Date;
  viewed: boolean;
  contacted: boolean;
}

const JobApplicationSchema: Schema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  hearAbout: { type: String, required: true },
  whyApply: { type: String, required: true },
  musicGenres: { type: String, required: true },
  threeAlbums: { type: String, required: false },
  barExperience: { type: String, required: true },
  cocktailExperience: { type: String, required: false },
  craftBeerWine: { type: String, required: false },
  busyRush: { type: String, required: true },
  difficultFeedback: { type: String, required: true },
  availability: { type: String, required: true },
  howSoonStart: { type: String, required: true },
  anythingElse: { type: String, required: false },
  resume: { type: Buffer, required: true },
  resumeContentType: { type: String, default: "application/pdf" },
  submittedAt: { type: Date, default: Date.now },
  viewed: { type: Boolean, default: false },
  contacted: { type: Boolean, default: false },
});

export default mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
