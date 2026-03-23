import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

export const EVENT_NAMES = [
  'creatorWS',
  'devWS',
  'modelerWS',
  'enigma',
  'techQuiz',
  'ooc',
  'nearProtocol',
  'negSpace', // Added Negative Space event
  // Legacy spellings kept for compatibility
  'Enigma',
  'Order of Chaos',
  'Tech Quiz',
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
export type PaymentStatus = 'not_paid' | 'pending' | 'paid';

export interface RegisteredEvent {
  eventName: EventName;
  registrationDate: Date;
  status: 'registered' | 'participated' | 'completed';
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  password: string;
  memberId?: string;
  freePass: boolean;
  regNo: string;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentAmount: number;
  paymentDate?: Date;
  registeredEvents: RegisteredEvent[];
  isVerified: boolean;
  verificationToken?: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  registerForEvent(eventName: EventName): void;
  getRegisteredEvents(): EventName[];
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9_]{3,30}$/, 'Username must be 3-30 characters and contain only letters, numbers, or underscores'],
    },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, select: false },
    memberId: { type: String, trim: true },
    freePass: { type: Boolean, default: false },
    regNo: { type: String, trim: true, required: true },
    paymentStatus: { type: String, enum: ['not_paid', 'pending', 'paid'], default: 'not_paid' },
    transactionId: { type: String, trim: true },
    paymentAmount: { type: Number, default: 0 },
    paymentDate: { type: Date },
    registeredEvents: [
      {
        eventName: { type: String, trim: true },
        registrationDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['registered', 'participated', 'completed'], default: 'registered' },
      },
    ],
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function hashPassword(this: IUser) {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function comparePassword(enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.registerForEvent = function registerForEvent(eventName: EventName) {
  const normalized = eventName.trim();

  const alreadyRegistered = this.registeredEvents.some((event: RegisteredEvent) => {
    if (!event.eventName) return false;
    return event.eventName.toLowerCase() === normalized.toLowerCase();
  });
  if (alreadyRegistered) {
    throw new Error(`Already registered for ${normalized}`);
  }

  this.registeredEvents.push({
    eventName: normalized,
    registrationDate: new Date(),
    status: 'registered',
  });
};

UserSchema.methods.getRegisteredEvents = function getRegisteredEvents() {
  return this.registeredEvents.map((event: RegisteredEvent) => event.eventName as EventName);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
