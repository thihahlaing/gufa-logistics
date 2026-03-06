'use client';

import { Drawer } from 'vaul';

export function BottomSheet({ children }: { children: React.ReactNode }) {
  return (
    <Drawer.Root shouldScaleBackground={true}>
      <Drawer.Trigger asChild>
        <button className="w-full p-4 text-left bg-gray-100 rounded-t-2xl border-t border-gray-200">Enter destination</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] max-h-[96%] mt-24 fixed bottom-0 left-0 right-0">
          <Drawer.Title className="sr-only">Address and Vehicle Selection</Drawer.Title>
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 my-4" />
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-md mx-auto">
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
