import React from "react";
import { Button } from "antd";
import { toast } from "react-toastify";

export default function AdminHeader() {
  return (
    <div className="mx-5 mt-4">
      <div className="flex items-center justify-between p-4 mb-4 bg-white border shadow-sm rounded-2xl">
        <div className="mr-20">
          <h2 className="text-xl font-bold">
            {new Date().toLocaleString("default", { month: "long" })}
          </h2>
          <p className="text-gray-500">
            Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center flex-1 gap-2 pl-5">
                    <h1 className="text-[23px] font-semibold">Board</h1>
                    <div className="text-[19px] font-medium text-gray-700">-</div>
                    <h4 className="text-[19px] font-medium text-gray-700">Daily Tasks</h4>
                </div>
        <Button
          type="default"
          onClick={() => toast.info("Calendar Coming Soon!")}
        >
          Check Calendar
        </Button>
      </div>

    </div>
  );
}
