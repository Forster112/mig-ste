export interface TEST {
  text: string;
}

export const Button = ({ text }: TEST) => {
  return <div>{text}</div>;
};
