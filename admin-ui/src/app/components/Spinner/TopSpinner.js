
import { CircularProgress, Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';

const TopSpinner = (props) => {
    return (
        <Dialog
            open={props.open}
        >
            <DialogContent>
                <div className="text-center">
                    <CircularProgress />
                    <h6 className='text-blue'>{props.message}</h6>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TopSpinner