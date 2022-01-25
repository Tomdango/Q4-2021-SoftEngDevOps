import {
  Button,
  Description,
  Fieldset,
  Input,
  Spacer,
  Text,
  Textarea,
  useToasts,
} from "@geist-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../../core/APIClient";

const RoomManagement: React.FC = () => {
  const navigate = useNavigate();
  const [, setToast] = useToasts();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    const room = await createRoom({
      name: data.name,
      description: data.description || "",
      capacity: parseInt(data.capacity, 10),
      location: data.location,
    });

    setToast({
      text: "Successfully Added Room",
      type: "success",
      actions: [
        {
          name: "View Room",
          handler: () => navigate(`/app/rooms/${room.room_id}`),
        },
      ],
    });
    reset();
  };

  return (
    <>
      <Description title="Room Management" mb={1} />
      <Fieldset.Group value="Add Room" width="100%">
        <Fieldset label="Add Room">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type={errors.name ? "error" : "default"}
              width="100%"
              placeholder="Name"
              {...register("name", { required: true })}
            />
            {errors.name?.type === "required" && (
              <Text small span type="error">
                Name is required
              </Text>
            )}
            <Spacer h={0.5} />
            <Textarea
              width="100%"
              placeholder="Description (optional)"
              {...register("description")}
            />
            <Spacer h={0.5} />
            <Input
              width="100%"
              placeholder="Location"
              type={errors.location ? "error" : "default"}
              {...register("location", { required: true })}
            />
            {errors.location?.type === "required" && (
              <Text small span type="error">
                Location is required
              </Text>
            )}
            <Spacer h={0.5} />
            <Input
              width="100%"
              placeholder="Capacity"
              htmlType="number"
              type={errors.capacity ? "error" : "default"}
              {...register("capacity", { required: true })}
            />
            {errors.capacity?.type === "required" && (
              <Text small span type="error">
                Capacity is required
              </Text>
            )}
            <Spacer h={1} />
            <Button type="success" auto htmlType="submit">
              Add
            </Button>
          </form>
        </Fieldset>
      </Fieldset.Group>
    </>
  );
};

export default RoomManagement;
