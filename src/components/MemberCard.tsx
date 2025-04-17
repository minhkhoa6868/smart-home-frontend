export default function MemberCard({
  name,
  avatar,
}: {
  name: string;
  avatar: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <img src={avatar} className="w-8 h-8 rounded-full" />
      <span className="text-sm font-medium text-gray-800">{name}</span>
    </div>
  );
}
