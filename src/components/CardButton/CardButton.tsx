import { Flex, LinkSetting, Text } from "@lawallet/ui";

const CardButton = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <LinkSetting onClick={onClick}>
      <Flex flex={1} align="start" justify="start">
        <Text isBold={true}>{text}</Text>
      </Flex>
    </LinkSetting>
  );
};

export default CardButton;
