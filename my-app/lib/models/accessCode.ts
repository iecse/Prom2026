import mongoose, { Model, Schema } from 'mongoose';

export interface IAccessCode {
  code: string;
  used: boolean;
  usedBy?: mongoose.Types.ObjectId;
  usedAt?: Date;
}

const AccessCodeSchema = new Schema<IAccessCode>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    used: { type: Boolean, default: false },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

const AccessCode: Model<IAccessCode> = mongoose.models.AccessCode || mongoose.model<IAccessCode>('AccessCode', AccessCodeSchema);

export default AccessCode;
