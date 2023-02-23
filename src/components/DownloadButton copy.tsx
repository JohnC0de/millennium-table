import { Button } from "primereact/button"
import { Product } from "../types"

type Props = {
  query: any
}

export default function RefreshQueryButton({ query }: Props) {
  return (
    <Button
      onClick={() => query.refetch()}
      type="button"
      icon="pi pi-refresh"
      text
    />
  )
}
