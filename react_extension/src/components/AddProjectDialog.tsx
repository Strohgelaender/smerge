import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createProject } from '../services/ProjectService';
import SchoolclassDto from './models/SchoolclassDto';
import ProjectDto from './models/ProjectDto';
import { useTranslation } from 'react-i18next';

const AddProjectDialog = (props: { schoolClass: SchoolclassDto; addProjectToState: (arg0: ProjectDto) => void; }) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title={t('AddProjectDialog.tooltip')}>
        <IconButton onClick={handleClickOpen}><AddIcon /></IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            console.log(name);
            createProject(name, props.schoolClass.id).then((res) => {
              if (!res) return;
              else props.addProjectToState(res);
            })
            handleClose();
          },
        }}
      >
        <DialogTitle>{t('AddProjectDialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('AddProjectDialog.description')}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('AddProjectDialog.cancel')}</Button>
          <Button type="submit">{t('AddProjectDialog.create')}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddProjectDialog;