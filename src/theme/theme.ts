import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#3554f2" },
        background: { default: "#f4f6fb", paper: "#ffffff" },
        text: { primary: "#151a25", secondary: "#666f82" },
        divider: "#e3e6ef",
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        h6: { fontWeight: 650, letterSpacing: "-0.01em" },
        subtitle2: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 550 },
    },
    components: {
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: ({ theme: currentTheme }) => ({
                    border: `1px solid ${currentTheme.palette.divider}`,
                }),
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600 },
            },
        },
    },
})
