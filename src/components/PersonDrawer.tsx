'use client'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useStore } from '@/lib/store'
import { Casualty } from '@/lib/dataLoader'

interface PersonDrawerProps {
  data: Casualty[]
}

export default function PersonDrawer({ data }: PersonDrawerProps) {
  const { selected, setSelected } = useStore()

  const person = data.find((p) => p.id === selected)

  return (
    <Drawer open={!!selected} onOpenChange={(isOpen) => !isOpen && setSelected(null)}>
      <DrawerContent className="bg-gray-900 text-white border-gray-800">
        <div className="mx-auto w-full max-w-lg">
          {person && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">{person.name_en}</DrawerTitle>
                <DrawerDescription className="text-xl text-gray-400">{person.name_ar}</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0 space-y-2">
                <p><strong>Age:</strong> {person.age}</p>
                <p><strong>Gender:</strong> {person.gender}</p>
                <p><strong>Date of Birth:</strong> {person.date_of_birth}</p>
                <p><strong>Source:</strong> {person.source}</p>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
