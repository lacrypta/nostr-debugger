import { appTheme } from "@/config/theme";
import { ButtonSetting, CaretRightIcon, Flex, Icon, Text } from "@lawallet/ui";
import React from "react";

const CardButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <ButtonSetting onClick={onClick}>
      <Flex flex={1} align="start" justify="start">
        <Text isBold={true}>{text}</Text>
      </Flex>

      <Icon size="small" color={appTheme.colors.gray40}>
        <CaretRightIcon />
      </Icon>
    </ButtonSetting>
  );
};

export default CardButton;
