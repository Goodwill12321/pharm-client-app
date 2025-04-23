import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface AuthMenuProps {
  open: boolean;
  onLogin: (login: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

const AuthMenu: React.FC<AuthMenuProps> = ({ open, onLogin, loading, error }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(login, password);
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Авторизация</DialogTitle>
        <DialogContent>
          <TextField
            label="Логин"
            value={login}
            onChange={e => setLogin(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
            required
          />
          <TextField
            label="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
            required
          />
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Войти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AuthMenu;
