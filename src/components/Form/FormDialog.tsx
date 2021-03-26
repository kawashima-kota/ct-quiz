import React, {useState, useCallback, useEffect} from 'react';
import TextInput from './TextInput';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface PROPS{
  open:boolean;
  handleOpen:any;
  handleClose:any;
}

const FormDialog:React.FC<PROPS> = (props:PROPS) => {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

    const inputDescription = useCallback((event) => {
        setDescription(event.target.value)
    },[setDescription]);

    const inputEmail = useCallback((event) => {
        setEmail(event.target.value);
    },[setEmail]);

    const inputName = useCallback((event) => {
        setName(event.target.value);
    },[setName]);

    const validateEmailFormat = (email:any) => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        return regex.test(email);
    }

    //必須項目に入力があるかをチェック
    const validateRequiredInput = (...args:any[]) => {
        let isBlank = false;
        for (let i = 0; i < args.length; i=(i+1)|0) {
            if (args[i] === "") {
                isBlank = true;
            }
        }
        return isBlank;
    };

    // Slackに問い合わせがあったことを通知する
    const submitForm = () => {
        const isBlank = validateRequiredInput(name, email, description)
        const isValidEmail = validateEmailFormat(email)

        if (isBlank) {
            alert('必須入力欄が空白です。');
            return false;
        } else if (!isValidEmail) {
            alert('メールアドレスの書式が異なります。');
            return false;
        } else {
            const payload = {
                text: 'お問い合わせがありました\n'
                    + 'お名前: ' + name + '\n'
                    + 'メールアドレス: ' + email + '\n'
                    + '【問い合わせ内容】\n' + description
            };

            //送信するslackURL
             const WEBHOOK_URL = "https://hooks.slack.com/services/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";

            // fetchメソッドでフォームの内容をSlackのIncoming Webhook URL に送信する
            fetch(WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            }).then(() => {
                alert('送信が完了しました。追ってご連絡いたします。');
                setDescription("");
                setEmail("");
                setName("");
                return props.handleClose();
            })
        }
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>お問い合わせフォーム</DialogTitle>
            <DialogContent>
                <TextInput
                    label={"名前(必須)"} multiline={false} rows={1}
                    value={name} type={"text"} onChange={inputName}
                />
                <TextInput
                    label={"メールアドレス(必須)"} multiline={false} rows={1}
                    value={email} type={"email"} onChange={inputEmail}
                />
                <TextInput
                    label={"お問い合わせ内容(必須)"} multiline={true} rows={5}
                    value={description} type={"text"} onChange={inputDescription}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    キャンセル
                </Button>
                <Button onClick={submitForm} color="primary">
                    送信する
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default FormDialog
