import placeholder from '../../public/images/placeholder.jpg';

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <img className="rounded-full" height="30" width="30" alt="Avatar" src={src || placeholder} />
  );
};

export default Avatar;
