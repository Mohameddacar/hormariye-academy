"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

const AddNewCourseDialog = ({ children, onCourseGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVideo: false,
    level: "",
    category: "",
    noOfChapters: 1,
  });

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGenerate = async () => {
    console.log(formData);
    try{
    setLoading(true);
    const result = await axios.post("/api/admin/courses", {
      ...formData,
    });
    console.log(result.data);
    setLoading(false);
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      includeVideo: false,
      level: "",
      category: "",
      noOfChapters: 1,
    });
    
    // Call the callback to refresh course list
    if (onCourseGenerated) {
      onCourseGenerated();
    }
}
catch(e){
    setLoading(false);
    console.log(e);
}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
              <div>
                <label>Name</label>
                <Input
                  placeholder="Course Name"
                  value={formData.name}
                  onChange={(event) =>
                    onHandleInputChange("name", event.target.value)
                  }
                />
              </div>

              <div>
                <label>Description</label>
                <Textarea
                  placeholder="Course Description"
                  value={formData.description}
                  onChange={(event) =>
                    onHandleInputChange("description", event.target.value)
                  }
                />
              </div>

              <div>
                <label>Number Of Chapters</label>
                <Input
                  placeholder="No of Chapters"
                  type="number"
                  value={formData.noOfChapters}
                  onChange={(event) =>
                    onHandleInputChange(
                      "noOfChapters",
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <label>Include Video</label>
                <Switch
                  checked={formData.includeVideo}
                  onCheckedChange={(checked) =>
                    onHandleInputChange("includeVideo", checked)
                  }
                />
              </div>

              <div className="mb-2">
                <label>Difficulty Level</label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => onHandleInputChange("level", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label>Category</label>
                <Input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(event) =>
                    onHandleInputChange("category", event.target.value)
                  }
                />
              </div>

              <div className="mt-5">
                <Button
                  className="w-full"
                  onClick={onGenerate}
                  disabled={loading}
                >
                  {loading && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
                  Create Course
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewCourseDialog;
