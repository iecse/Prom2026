import mongoose, { Model, Schema } from 'mongoose';


export interface IAccessCode {
  regno: string;
  memberId: string;
  used: boolean;
  usedBy?: mongoose.Types.ObjectId;
  usedByUsername?: string;
  usedAt?: Date;
}


const AccessCodeSchema = new Schema<IAccessCode>(
  {
    regno: { type: String, required: true, trim: true },
    memberId: { type: String, required: true, trim: true },
    used: { type: Boolean, default: false },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    usedByUsername: { type: String },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

AccessCodeSchema.index({ regno: 1, memberId: 1 }, { unique: true });
const AccessCode: Model<IAccessCode> = mongoose.models.AccessCode || mongoose.model<IAccessCode>('AccessCode', AccessCodeSchema);

export default AccessCode;
