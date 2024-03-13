import { Button } from "@/components/ui/button";
import Image from 'next/image';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import WorkpaceTypeDropDown from "./WorkspaceType/page";
import InviteCollab from "./InviteCollab/page";
import useStore from "@/Stores/store";

interface SettingsSliderProps {
  workspaceId: string;
  workspaceName: string;
  workspaceLogoIndex: number | null,
  workspaceType: string;
}

export function SettingsSlider({ workspaceId,workspaceName, workspaceLogoIndex,workspaceType }: SettingsSliderProps) {

  console.log("workspaceIdworkspaceId",workspaceId);
  const imgPaths = [
    "/Assets/workspace1.jpg",
    "/Assets/workspace2.jpg",
    "/Assets/workspace3.jpg",
    "/Assets/workspace4.jpg",
    "/Assets/briefcase_439354.png",
    "/Assets/workspace5.webp",
    "/Assets/workspace6.png",
    "/Assets/workspace7.webp",
    "/Assets/workspace8.png",
    "/Assets/workspace9.webp",
    "/Assets/workspace10.png",
    "/Assets/workspace11.png",
    "/Assets/workspace12.png",
    "/Assets/workspace13.jpg",
    "/Assets/workspace14.png",
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MdOutlineSettingsSuggest size={23} style={{ opacity: 0.8 }} />
      </SheetTrigger>
      <SheetContent className="bg-sidebar/80" side={"left"}>
        <SheetHeader>
          <SheetTitle className="font-sans flex justify-center">
            <span>Workspace Settings</span>
          </SheetTitle>
          <div className="flex items-center py-4">
            {workspaceLogoIndex !== null && (
              <Image
                src={imgPaths[workspaceLogoIndex]}
                alt={`Workspace Logo`}
                width={22}
                height={25}
                className="mr-2"
              />
            )}
            <span className="text-xl">{workspaceName}</span>
            <WorkpaceTypeDropDown workspaceId={workspaceId} workspaceType={workspaceType}/>
            <BsPencilSquare className="ml-auto" />
          </div>
          <SheetDescription>
            By default, your workspace is private.
            Make changes to your workspace settings here to add collaborators to share your workspace in real-time.
          </SheetDescription>
          <div className="border-2 border-white border-opacity-65 cursor-pointer h-14 py-6 flex items-center rounded-md p-2 my-2">
            
            <InviteCollab workspaceId={workspaceId} workspaceType={workspaceType}/>
            
          </div>

          <div className="border-2 border-red-500 cursor-pointer border-opacity-65 h- py-6 flex items-center rounded-md p-2 my-2">
          
          <span className="text-red-500">Delete My Workspace</span>
        </div>

        </SheetHeader>

        <SheetFooter>
          <SheetClose asChild>
          
          </SheetClose>
         
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
