import type React from "react"
import { List, useTable, EditButton, DeleteButton, getDefaultSortOrder, FilterDropdown } from "@refinedev/antd"
import { Table, Space, Input, Tag } from "antd"
import { SearchOutlined } from "@ant-design/icons"

export const CategoryList: React.FC = () => {
  const { tableProps, sorters, filters } = useTable({
    syncWithLocation: true,
  })

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" sorter defaultSortOrder={getDefaultSortOrder("id", sorters)} />
        <Table.Column
          dataIndex="name"
          title="Name"
          sorter
          defaultSortOrder={getDefaultSortOrder("name", sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search name" prefix={<SearchOutlined />} autoFocus />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="description"
          title="Description"
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search description" prefix={<SearchOutlined />} autoFocus />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="productCount"
          title="Products"
          render={(value) => <Tag color="blue">{value || 0}</Tag>}
        />
        <Table.Column<any>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  )
}

export { CategoryCreate } from "./create"
export { CategoryEdit } from "./edit"

