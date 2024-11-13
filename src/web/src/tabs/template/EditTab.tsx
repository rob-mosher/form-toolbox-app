import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Bars2 } from '../../assets'
import Divider from '../../components/Divider'
import Heading from '../../components/Heading'
import { sortFormSchemaKeysByOrder, API_ENDPOINT } from '../../lib'
import type { TTemplate } from '../../types'

type SortableItemProps = {
  id: string;
  formSchema: TTemplate['formSchema'];
}

function SortableItem({ id, formSchema }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='mb-4 flex flex-row items-center justify-start gap-x-4'
    >
      <div
        className='cursor-move'
        {...attributes}
        {...listeners}
      >
        <Bars2 />
      </div>
      <div className='grow text-sm font-semibold'>{id}</div>
      <div className='text-sm text-gray-500'>{formSchema[id].type}</div>
    </div>
  )
}

type EditTabProps = {
  template: TTemplate;
}

export default function EditTab({
  template,
}: EditTabProps) {
  const [orderedKeys, setOrderedKeys] = useState(() => {
    const { formSchema, formSchemaOrder } = template
    return sortFormSchemaKeysByOrder(formSchema, formSchemaOrder)
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setOrderedKeys((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)

        // Update the backend
        axios.patch(`${API_ENDPOINT}/api/templates/${template.id}`, {
          updates: {
            formSchemaOrder: newOrder,
          },
        })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error updating form schema order:', error)
            toast.error('Error updating form order')
          })

        return newOrder
      })
    }
  }

  const renderOrderedFields = () => {
    if (!template) {
      return <div>Loading template...</div>
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedKeys}
          strategy={verticalListSortingStrategy}
        >
          {orderedKeys.map((key) => (
            <SortableItem
              key={key}
              id={key}
              formSchema={template.formSchema}
            />
          ))}
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <div data-tab='edit'>
      <form>
        <Divider>
          <Heading as='h6' uppercase>Form Schema</Heading>
        </Divider>
        <div className='space-y-4'>
          {renderOrderedFields()}
        </div>
      </form>
    </div>
  )
}
