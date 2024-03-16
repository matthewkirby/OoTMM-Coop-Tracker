import { AccordionDetailsProps, AccordionSummaryProps, styled } from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { NavigateNext } from "@mui/icons-material";

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<NavigateNext />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "#1e1e1e",
  position: "sticky",
  top: "0",
  zIndex: "1000",
  flexDirection: 'row-reverse',
  borderTop: "1px rgba(255, 255, 255, 0.12) solid",
  fontWeight: "800",
  '&:hover': {
    backgroundColor: "#101010"
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

export const AccordionDetails = styled((props: AccordionDetailsProps) => (
  <MuiAccordionDetails {...props} />
))(() => ({
  padding: "0px",
  backgroundColor: "var(--raise-element)"
}));