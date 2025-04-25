import { useEffect, useState } from "react";
import MemberCard from "./MemberCard";
import axios from "axios";

interface Member {
  name: string;
}

export default function RightPanel() {
  // const members = [
  //   { name: "Jaquiline", avatar: "https://i.pravatar.cc/100?u=1" },
  //   { name: "Sennorita", avatar: "https://i.pravatar.cc/100?u=2" },
  //   { name: "Firoz", avatar: "https://i.pravatar.cc/100?u=3" },
  // ];

  const [members, setMembers] = useState<Member[]>([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`https://smart-home-backend-07op.onrender.com/api/user/${userId}/members`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setMembers(response.data);
    } catch (error: any) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, [setMembers])

  return (
    <div className="space-y-4">
      {/* Members */}
      <h3 className="font-semibold ml-2">Members</h3>
      <div className="bg-white rounded-xl p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <a href="#" className="text-sm text-blue-500">
            View all
          </a>
        </div>
        <div className="space-y-2">
          {members.map((m, index) => (
            <MemberCard key={index} name={m.name} />
          ))}
        </div>
        <button className="mt-4 w-full bg-blue-100 text-blue-600 rounded-full py-2 text-sm font-medium">
          Add Member
        </button>
      </div>
    </div>
  );
}
