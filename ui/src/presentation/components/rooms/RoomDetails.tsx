import { Card, Description, Grid, Text } from "@geist-ui/core";
import React from "react";

const RoomDetails: React.FC<any> = (props) => {
  return (
    <Card shadow width="100%" height="min-content" mb={2}>
      <Text h2 font="25px" mt={0} mb={1}>
        Details
      </Text>
      <Grid.Container gap={4}>
        <Grid xs={12} direction="column">
          <Description
            title="Name"
            content={
              <Text h5 mt={0.5}>
                {props.name}
              </Text>
            }
          />
          <Description
            title="Description"
            content={
              <Text h5 mt={0.5}>
                {props.description || "No description"}
              </Text>
            }
          />
        </Grid>
        <Grid xs={12} direction="column">
          <Description
            title="Location"
            content={
              <Text h5 mt={0.5}>
                {props.location}
              </Text>
            }
          />
          <Description
            title="Capacity"
            content={
              <Text h5 mt={0.5} mb={0}>
                {props.capacity}
              </Text>
            }
          />
        </Grid>
      </Grid.Container>
    </Card>
  );
};

export default RoomDetails;
