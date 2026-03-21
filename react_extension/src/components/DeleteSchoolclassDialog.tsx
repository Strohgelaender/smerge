import { useState, MouseEvent, Fragment } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteSchoolclass } from '../services/SchoolclassService';
import SchoolclassDto from './models/SchoolclassDto';
import ProjectDto from './models/ProjectDto';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface DeleteSchoolclassDialogProps {
  schoolclass: SchoolclassDto;
  projects: ProjectDto[];
  onSchoolclassDeleted: (schoolclassId: string) => void;
}

const DeleteSchoolclassDialog = (props: DeleteSchoolclassDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();

  const handleClickOpen = (e: MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteSchoolclass(props.schoolclass.id);
    setIsDeleting(false);

    if (!res) {
      toast.error(t('TeacherView.deleteFailed'), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
      });
      return;
    }

    toast.success(t('TeacherView.deleteSuccess'), {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
    });

    props.onSchoolclassDeleted(props.schoolclass.id);
    handleClose();
  };

  return (
    <Fragment>
      <Tooltip title={t('DeleteSchoolclassDialog.tooltip')}>
        <IconButton
          size="small"
          color="error"
          onClick={handleClickOpen}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="deleteSchoolclassTitle">{t('TeacherView.deleteDialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('TeacherView.deleteDialog.text', {
              name: props.schoolclass.name,
              count: props.projects.length,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('TeacherView.cancel')}</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {t('TeacherView.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DeleteSchoolclassDialog;

