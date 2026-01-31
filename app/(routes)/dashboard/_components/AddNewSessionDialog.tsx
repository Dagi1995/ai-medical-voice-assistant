"use clinet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

const [note,setNote]=useState <string> ("")
const [Loading,setLoading]= useState (false)
const OnclickNext= async()=> {
  setLoading(true);
  const result = await axios.post('/api/suggest-doctors', {
    notes: note
  });
   console.log(result.data);
}
function AddNewSessionDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="mt-3">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <div>
                <h2>Add Symptoms or Other Details</h2>
                <Textarea placeholder="Add Detail here..." className="h=[200px] mt-1"
                onChange={(e)=> setNote (e.target.value)}/>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter> 
            <DialogClose>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={!note.trim()}>Next <ArrowRight></ArrowRight></Button>
         </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
