// ================= MASTER ENTERPRISE VERSION =================

import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  MenuItem,
} from "@mui/material";

import {
  TableChartRounded,
  AssignmentRounded,
  DeleteRounded,
  FileDownloadRounded,
  AddCircleOutlineRounded,
  CloudUploadRounded,
  WarningAmberRounded,
  AutorenewRounded,
} from "@mui/icons-material";

import { useForm, Controller } from "react-hook-form";
import { MaterialReactTable } from "material-react-table";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// ================= THEME =================
const THEME = {
  pageBg: "#F4F7FB",
  accent: "#4A90E2",
  gradient: "linear-gradient(135deg,#4A90E2 0%, #6FA8FF 100%)",
  tableHeader: "#4A5F7A",
  headerBorder: "#D6DFEA",
  cellBorder: "#E3E8F2",
  danger: "#E53935",
};

// ================= STATIC FORM HEADERS =================
const REQUIRED_HEADERS = [
  "sino",
  "projectDescription",
  "customerName",
  "lineltemWiseValue",
  "totalValue",
  "revisedValue",
  "remarks",
  "projectManager",
];

const normalize = (str) => str?.toString().trim().toLowerCase();

export default function ContractAssetsForm() {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  // ================= TEMPLATE STATES =================
  const [dynamicColumns, setDynamicColumns] = useState(() => {
    const saved = localStorage.getItem("dynamicColumns");
    return saved ? JSON.parse(saved) : [];
  });

  const [templateDialog, setTemplateDialog] = useState(false);
  const [columnCount, setColumnCount] = useState("");
  const [columnNames, setColumnNames] = useState([]);

  const templateCreated = dynamicColumns.length > 0;

  // ================= UPLOAD STATES =================
  const [previewRows, setPreviewRows] = useState([]);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  // ================= CREATE TEMPLATE =================
  const handleColumnCountSubmit = () => {
    const count = parseInt(columnCount);
    if (!count || count <= 0) return;
    setColumnNames(Array(count).fill(""));
  };

  const handleCreateTemplate = () => {
    const cols = columnNames.map((name) => ({
      header: name,
      accessorKey: name,
    }));
    setDynamicColumns(cols);
    localStorage.setItem("dynamicColumns", JSON.stringify(cols));
    setTemplateDialog(false);
    setSuccessMsg("Template Created Successfully");
  };

  const handleChangeTemplate = () => {
    localStorage.removeItem("dynamicColumns");
    setDynamicColumns([]);
    setColumnNames([]);
    setColumnCount("");
    setData([]);
    setSuccessMsg("Template Reset Successfully");
  };

  // ================= DATA ENTRY =================
  const onSubmit = (formData) => {
    setData((prev) => [...prev, formData]);
    reset();
    setSuccessMsg("Entry Added Successfully");
  };

  // ================= BULK EXCEL UPLOAD =================
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!json.length) return;

      const excelHeaders = json[0].map(normalize);
      const tableHeaders = dynamicColumns.map((c) =>
        normalize(c.header)
      );

      const missingHeaders = tableHeaders.filter(
        (h) => !excelHeaders.includes(h)
      );

      if (missingHeaders.length > 0) {
        setUploadErrors([
          `Missing Columns: ${missingHeaders.join(", ")}`,
        ]);
        setPreviewRows([]);
        setPreviewOpen(true);
        return;
      }

      const headerIndexMap = {};
      excelHeaders.forEach((h, i) => {
        headerIndexMap[h] = i;
      });

      const rows = json.slice(1).map((row, index) => {
        const obj = {};
        dynamicColumns.forEach((col) => {
          const idx = headerIndexMap[normalize(col.header)];
          obj[col.accessorKey] = row[idx] || "";
        });
        return obj;
      });

      // Duplicate detection
      const duplicates = rows.filter((r) =>
        data.some(
          (existing) =>
            JSON.stringify(existing) === JSON.stringify(r)
        )
      );

      const errors = [];
      if (duplicates.length > 0) {
        errors.push(`${duplicates.length} duplicate rows detected`);
      }

      setUploadErrors(errors);
      setPreviewRows(rows);
      setPreviewOpen(true);
    };

    reader.readAsBinaryString(file);
  };

  const confirmUpload = () => {
    const filtered = previewRows.filter(
      (row) =>
        !data.some(
          (existing) =>
            JSON.stringify(existing) === JSON.stringify(row)
        )
    );

    setData((prev) => [...prev, ...filtered]);
    setPreviewOpen(false);
    setSuccessMsg("Bulk Upload Successful");
  };

  // ================= EXPORT =================
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dynamic Table");

    const headers = dynamicColumns.map((c) => c.header);
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4A5F7A" },
      };
      cell.alignment = { horizontal: "center" };
    });

    data.forEach((row) => {
      worksheet.addRow(
        dynamicColumns.map((c) => row[c.accessorKey] || "")
      );
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Dynamic_Table.xlsx");
  };

  const columns = useMemo(() => dynamicColumns, [dynamicColumns]);

  return (
    <Container maxWidth="xl" sx={{ mt: 3, background: THEME.pageBg }}>
      {/* ================= TABS ================= */}
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        centered
        sx={{
          mb: 4,
          "& .Mui-selected": { color: THEME.accent },
          "& .MuiTabs-indicator": { backgroundColor: THEME.accent },
        }}
      >
        <Tab icon={<AssignmentRounded />} label="Data Entry" />
        <Tab icon={<TableChartRounded />} label="Records Dashboard" />
      </Tabs>

      {/* ================= DATA ENTRY ================= */}
      {tabValue === 0 && (
        <Paper sx={{ p: 5, borderRadius: 4 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              background: THEME.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
            }}
          >
            Contract Asset Entry
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {REQUIRED_HEADERS.map((key) => (
                <Grid item xs={12} md={6} key={key}>
                  <Controller
                    name={key}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={key}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              ))}
            </Grid>

            <Box textAlign="center" mt={5}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: THEME.gradient,
                  px: 6,
                  borderRadius: 3,
                  fontWeight: 700,
                }}
              >
                Submit Entry
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* ================= TABLE TAB ================= */}
      {tabValue === 1 && (
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          {!templateCreated ? (
            <Box textAlign="center">
              <Button
                startIcon={<AddCircleOutlineRounded />}
                variant="contained"
                onClick={() => setTemplateDialog(true)}
                sx={{ background: THEME.gradient }}
              >
                Create Template
              </Button>
            </Box>
          ) : (
            <>
              <Stack direction="row" spacing={2} mb={3}>
                <Button
                  startIcon={<CloudUploadRounded />}
                  variant="contained"
                  sx={{ background: THEME.gradient }}
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload Excel
                </Button>

                <Button
                  startIcon={<FileDownloadRounded />}
                  variant="contained"
                  sx={{ background: THEME.gradient }}
                  onClick={exportToExcel}
                >
                  Export Excel
                </Button>

                <Button
                  startIcon={<AutorenewRounded />}
                  variant="outlined"
                  onClick={handleChangeTemplate}
                >
                  Change Template
                </Button>

                <input
                  hidden
                  type="file"
                  accept=".xlsx,.xls"
                  ref={fileInputRef}
                  onChange={handleExcelUpload}
                />
              </Stack>

              <MaterialReactTable
                columns={columns}
                data={data}
                enableSorting
                enableColumnFilters
                enableRowNumbers
                enableStickyHeader
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: THEME.tableHeader,
                    color: "#fff",
                    fontWeight: 700,
                    border: `1px solid ${THEME.headerBorder}`,
                  },
                }}
                muiTableHeadCellFilterTextFieldProps={{
                  sx: {
                    "& .MuiSvgIcon-root": {
                      color: "#ffffff !important",
                      fontSize: "1.3rem",
                    },
                    input: { color: "#fff" },
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    border: `1px solid ${THEME.cellBorder}`,
                  },
                }}
              />
            </>
          )}
        </Paper>
      )}

      {/* ================= TEMPLATE DIALOG ================= */}
      <Dialog open={templateDialog} onClose={() => setTemplateDialog(false)}>
        <DialogTitle>Create Template</DialogTitle>
        <DialogContent>
          {columnNames.length === 0 ? (
            <TextField
              fullWidth
              label="Enter Number of Columns"
              type="number"
              value={columnCount}
              onChange={(e) => setColumnCount(e.target.value)}
            />
          ) : (
            columnNames.map((col, index) => (
              <TextField
                key={index}
                fullWidth
                label={`Column ${index + 1} Name`}
                sx={{ mt: 2 }}
                value={col}
                onChange={(e) => {
                  const updated = [...columnNames];
                  updated[index] = e.target.value;
                  setColumnNames(updated);
                }}
              />
            ))
          )}
        </DialogContent>
        <DialogActions>
          {columnNames.length === 0 ? (
            <Button onClick={handleColumnCountSubmit}>Next</Button>
          ) : (
            <Button onClick={handleCreateTemplate}>
              Create Table
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ================= PREVIEW DIALOG ================= */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Excel Upload Preview</DialogTitle>
        <DialogContent>
          {uploadErrors.length > 0 && (
            <Box mb={2}>
              {uploadErrors.map((err, i) => (
                <Chip
                  key={i}
                  icon={<WarningAmberRounded />}
                  label={err}
                  color="error"
                  sx={{ mr: 1 }}
                />
              ))}
            </Box>
          )}

          <MaterialReactTable
            columns={columns}
            data={previewRows}
            enableSorting
            enablePagination
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmUpload}
            sx={{ background: THEME.gradient }}
          >
            Confirm Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= SNACKBAR ================= */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert severity="success">{successMsg}</Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={3000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
}