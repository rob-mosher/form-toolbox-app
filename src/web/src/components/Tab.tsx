import { mergeClassName } from '../lib'
import type { TTab } from '../types'

type TabProps = {
  tabs: TTab[];
  onTabChange: (id: string) => void;
  activeTab: string;
};

export default function Tab({ tabs, onTabChange, activeTab }: TabProps) {
  return (
    <div className='flex gap-2'>
      {tabs.map((tab) => (
        <button
          type='button'
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={mergeClassName(
            'relative top-[1px] flex items-center z-10 px-6 text-sm h-9 border border-x-gray-300 border-t-gray-300 rounded-t-lg',
            activeTab === tab.id
              ? 'bg-white border-b-transparent font-semibold'
              : 'bg-gray-50 hover:text-gray-700',
          )}
        >
          {tab.icon && <span className='mr-2'>{tab.icon}</span>}
          {tab.content}
        </button>
      ))}
    </div>
  )
}
