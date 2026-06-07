import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/i18n/I18nProvider";
import DataTable, { type DataTableColumn } from "./DataTable";

type Row = {
  id: string;
  name: string;
};

describe("DataTable", () => {
  beforeEach(() => {
    window.localStorage.setItem("cryptosparrow-locale", "en");
    window.history.pushState({}, "", "/dashboard");
  });

  it("applies horizontal padding for empty-state message", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[]}
          columns={columns}
          getRowId={(row) => row.id}
          emptyText="Brak wpisow"
        />
      </I18nProvider>,
    );

    const emptyMessage = screen.getByText("Brak wpisow");
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage).toHaveClass("px-3");
  });

  it("enables advanced controls as opt-in even without explicit pagination", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          advancedMode
        />
      </I18nProvider>
    );

    expect(screen.getByRole("button", { name: "Columns" })).toBeInTheDocument();
    expect(screen.getByText("Rows: 1")).toBeInTheDocument();
  });

  it("preserves zero total pages for empty manual pagination metadata", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[]}
          columns={columns}
          getRowId={(row) => row.id}
          emptyText="No trades"
          paginationEnabled
          manualPagination
          page={1}
          pageSize={10}
          totalRows={0}
          totalPages={0}
          hasPrev={false}
          hasNext={false}
          paginationSummary={({ page, totalPages }) => `Page ${page}/${totalPages}`}
        />
      </I18nProvider>
    );

    expect(screen.getByText("Rows: 0")).toBeInTheDocument();
    expect(screen.getByText("Page 1/0")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  it("reports an external row total without creating client-side pages", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          defaultPageSize={10}
          reportedTotalRows={3}
        />
      </I18nProvider>
    );

    expect(screen.getByText("Rows: 3")).toBeInTheDocument();
    expect(screen.queryByText("Page")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  it("does not report fewer rows than are currently visible", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          reportedTotalRows={0}
        />
      </I18nProvider>
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Rows: 1")).toBeInTheDocument();
  });

  it("does not report fewer rows than are visible with manual pagination", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          manualPagination
          page={1}
          pageSize={10}
          totalRows={0}
          totalPages={0}
          reportedTotalRows={0}
        />
      </I18nProvider>
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Rows: 1")).toBeInTheDocument();
  });

  it("clamps manual pagination metadata to visible rows without reported totals", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          manualPagination
          page={1}
          pageSize={10}
          totalRows={0}
          totalPages={0}
        />
      </I18nProvider>
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Rows: 1")).toBeInTheDocument();
  });

  it("clamps zero manual total pages when rows are visible", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          manualPagination
          page={1}
          pageSize={10}
          totalRows={0}
          totalPages={0}
          paginationSummary={({ page, totalPages }) => `Page ${page}/${totalPages}`}
        />
      </I18nProvider>
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Rows: 1")).toBeInTheDocument();
    expect(screen.getByText("Page 1/1")).toBeInTheDocument();
  });

  it("keeps columns dropdown open on checkbox toggle and closes only via trigger/outside/Escape", () => {
    const columns: DataTableColumn<Row & { exchange: string }>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
      {
        key: "exchange",
        label: "Exchange",
        accessor: (row) => row.exchange,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row & { exchange: string }>
          rows={[{ id: "1", name: "Alpha", exchange: "BINANCE" }]}
          columns={columns}
          getRowId={(row) => row.id}
          advancedMode
        />
      </I18nProvider>
    );

    const columnsTrigger = screen.getByRole("button", { name: "Columns" });
    expect(columnsTrigger).toHaveClass("w-8");
    expect(columnsTrigger).toHaveClass("px-0");

    fireEvent.click(columnsTrigger);
    const exchangeCheckbox = screen.getByRole("checkbox", { name: "Exchange" });
    fireEvent.click(exchangeCheckbox);
    expect(screen.getByRole("checkbox", { name: "Exchange" })).toBeInTheDocument();

    fireEvent.click(columnsTrigger);
    expect(screen.queryByRole("checkbox", { name: "Exchange" })).not.toBeInTheDocument();

    fireEvent.click(columnsTrigger);
    expect(screen.getByRole("checkbox", { name: "Exchange" })).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("checkbox", { name: "Exchange" })).not.toBeInTheDocument();

    fireEvent.click(columnsTrigger);
    expect(screen.getByRole("checkbox", { name: "Exchange" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("checkbox", { name: "Exchange" })).not.toBeInTheDocument();
  });

  it("sorts sortable columns through ascending, descending, and cleared states", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        sortable: true,
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[
            { id: "2", name: "Beta" },
            { id: "1", name: "Alpha" },
          ]}
          columns={columns}
          getRowId={(row) => row.id}
          showSearch={false}
        />
      </I18nProvider>
    );

    const currentCells = () => screen.getAllByRole("cell").map((cell) => cell.textContent);
    const nameHeader = screen.getByRole("button", { name: /Name/ });

    expect(currentCells()).toEqual(["Beta", "Alpha"]);

    fireEvent.click(nameHeader);
    expect(currentCells()).toEqual(["Alpha", "Beta"]);

    fireEvent.click(nameHeader);
    expect(currentCells()).toEqual(["Beta", "Alpha"]);

    fireEvent.click(nameHeader);
    expect(currentCells()).toEqual(["Beta", "Alpha"]);
  });

  it("filters rows locally and trims submitted search callbacks", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];
    const onSearch = vi.fn();

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[
            { id: "1", name: "Alpha" },
            { id: "2", name: "Beta" },
          ]}
          columns={columns}
          getRowId={(row) => row.id}
          onSearch={onSearch}
        />
      </I18nProvider>
    );

    const filterInput = screen.getByPlaceholderText("Filter...");
    fireEvent.change(filterInput, { target: { value: " alp " } });

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();

    fireEvent.keyDown(filterInput, { key: "Enter" });
    expect(onSearch).toHaveBeenCalledWith("alp");
  });

  it("normalizes page input changes before dispatching page navigation", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];
    const onPageChange = vi.fn();

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[{ id: "1", name: "Alpha" }]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          manualPagination
          page={1}
          pageSize={10}
          totalRows={30}
          totalPages={3}
          hasPrev={false}
          hasNext
          onPageChange={onPageChange}
        />
      </I18nProvider>
    );

    const pageInput = screen.getByLabelText("Page input");

    fireEvent.change(pageInput, { target: { value: "9" } });
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(pageInput).toHaveValue(3);

    fireEvent.change(pageInput, { target: { value: "0" } });
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(pageInput).toHaveValue(1);
  });

  it("resets pagination when the page size changes", () => {
    const columns: DataTableColumn<Row>[] = [
      {
        key: "name",
        label: "Name",
        accessor: (row) => row.name,
      },
    ];

    render(
      <I18nProvider>
        <DataTable<Row>
          rows={[
            { id: "1", name: "Alpha" },
            { id: "2", name: "Beta" },
            { id: "3", name: "Gamma" },
          ]}
          columns={columns}
          getRowId={(row) => row.id}
          paginationEnabled
          pageSizeOptions={[1, 2]}
          defaultPageSize={1}
        />
      </I18nProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "2" } });

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Gamma")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Page input")).toHaveValue(1);
  });
});
