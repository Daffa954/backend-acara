import mongoose, { ObjectId } from "mongoose";

import * as Yup from "yup";

const Schema = mongoose.Schema;

export const eventDAO = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  banner: Yup.string().required(),
  isFeatured: Yup.boolean().required(),
  isOnline: Yup.boolean().required(),
  isPublish: Yup.boolean(),
  category: Yup.string().required(),
  slug: Yup.string(),
  createdBy: Yup.string().required(),
  createdAt: Yup.string(),
  updatedAt: Yup.string(),
  location: Yup.object().required(),
});

export type TEvent = Yup.InferType<typeof eventDAO>;

export interface Event extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EventSchema = new Schema<Event>(
  {
    name: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    startDate: { type: Schema.Types.String, required: true },
    endDate: { type: Schema.Types.String, required: true },
    banner: { type: Schema.Types.String, required: true },
    isFeatured: { type: Schema.Types.Boolean, required: true },
    isOnline: { type: Schema.Types.Boolean, required: true },
    isPublish: { type: Schema.Types.Boolean, default: false },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    slug: { type: Schema.Types.String, required: true, unique: true },
    location: {
      type: {
        region: {
          type: Schema.Types.Number,
          ref: "Region",
          required: true,
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

EventSchema.pre("save", function (next) {
  if (!this.slug) {
    const slug = this.name.split(" ").join("-").toLowerCase();
    this.slug = `${slug}`;
  }
});


const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;