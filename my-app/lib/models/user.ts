import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

export type EventName = 'Enigma' | 'Order of Chaos' | 'Tech Quiz';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface RegisteredEvent {
  eventName: EventName;
  registrationDate: Date;
  status: 'registered' | 'participated' | 'completed';
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, select: false },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: { type: String, trim: true },
    paymentAmount: { type: Number, default: 0 },
    paymentDate: { type: Date },
    registeredEvents: [
      {
        eventName: { type: String, enum: ['Enigma', 'Order of Chaos', 'Tech Quiz'] },
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
  const alreadyRegistered = this.registeredEvents.some((event: RegisteredEvent) => event.eventName === eventName);
  if (alreadyRegistered) {
    throw new Error(`Already registered for ${eventName}`);
  }

  this.registeredEvents.push({
    eventName,
    registrationDate: new Date(),
    status: 'registered',
  });
};

UserSchema.methods.getRegisteredEvents = function getRegisteredEvents() {
  return this.registeredEvents.map((event: RegisteredEvent) => event.eventName as EventName);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
