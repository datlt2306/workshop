import type React from "react"
import { Edit, useForm } from "@refinedev/antd"
import { Form, Input } from "antd"

export const CategoryEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm()

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter a category name",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  )
}

