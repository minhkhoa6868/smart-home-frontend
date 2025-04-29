import Sidebar from "../components/Sidebar";

import RightPanel from "../components/RightPanel";
import SecurityMode from "../components/SecurityMode";
import LightScheduleMode from "../components/LightScheduleMode";

export default function DeviceControl() {
  return (
    <div className="grid grid-cols-12 gap-8 min-h-screen p-6 bg-[#E8F3FC]">
      {/* Sidebar - Left */}
      <div className="col-span-2">
        <Sidebar />
      </div>
      {/* Main Content - Center */}
      <div className="col-span-8 space-y-8">
        <SecurityMode />
        <LightScheduleMode />
      </div>

      <div className="col-span-2">
        <RightPanel />
      </div>
    </div>
  );
}
