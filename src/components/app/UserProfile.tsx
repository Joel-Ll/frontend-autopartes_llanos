import { FaUserCircle } from "react-icons/fa";


type UserProfileProps = {
  name: string;
}

export default function UserProfile({ name }: UserProfileProps) {
  return (
    <>
      <div className="flex flex-col items-center gap-1 pt-16">
        <FaUserCircle
          className="mb-2 size-20"
          color="#fff"
        />
        <p className="capitalize font-bold text-xl text-white">{name}</p>
      </div>
    </>
  )
}
