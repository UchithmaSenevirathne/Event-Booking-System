import React from "react";
import { Button } from "antd";
import { toast } from "react-toastify";

export default function UserHeader() {
  return (
    <div className="mx-5 mt-4">
      <div className="flex items-center justify-between p-4 mb-4 bg-white border shadow-sm rounded-2xl">
        <div>
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
