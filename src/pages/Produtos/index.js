import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Produto from '../../components/Produto';
import useAuth from '../../hook/useAuth';
import { get } from '../../services/ApiClient';
import useStyles from './styles';

function Produtos() {
  const classes = useStyles();
  const history = useHistory();
  const { token } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {
    setCarregar(false);

    async function carregarProdutos() {
      try {
        setCarregando(true);
        setErro('');

        const { dados, erro } = await get('produtos', token);

        if (erro) {
          setErro(dados);
          return;
        }

        setProdutos(dados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, [token, carregar]);

  return (
    <>
      <Typography variant="h4">Seus produtos</Typography>
      <Grid container spacing={4}>
        {produtos.map((produto) => (
          <Grid className={classes.produto} item key={produto.id}>
            <Produto {...produto} recarregar={() => setCarregar(true)} />
          </Grid>
        ))}
      </Grid>
      <Divider className={classes.divider} />
      <Button
        className={classes.botao}
        onClick={() => history.push('/produtos/novo')}
      >
        ADICIONAR PRODUTO
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        open={!!erro}
        key={erro}
      >
        <Alert onClose={() => setErro('')} severity="error">
          {erro}
        </Alert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={carregando}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default Produtos;
