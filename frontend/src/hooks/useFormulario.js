import { useCallback, useState } from 'react';

/**
 * Gerencia valores, erros e validação de um formulário controlado.
 * @param {object} valoresIniciais - Valor inicial de cada campo.
 * @param {(nome: string, valor: string) => string} validarCampo - Devolve a mensagem de erro do campo, ou ''.
 * @param {Record<string, (valor: string) => string>} [mascaras] - Máscara aplicada ao digitar, por campo.
 */
export function useFormulario(valoresIniciais, validarCampo, mascaras = {}) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [tocados, setTocados] = useState({});

  // A cada tecla: aplica a máscara e, se o campo já foi visitado, revalida em tempo real
  function aoMudar(evento) {
    const { name, value } = evento.target;
    const valorFinal = mascaras[name] ? mascaras[name](value) : value;

    setValores((anteriores) => ({ ...anteriores, [name]: valorFinal }));
    if (tocados[name]) {
      setErros((anteriores) => ({ ...anteriores, [name]: validarCampo(name, valorFinal) }));
    }
  }

  // Ao sair do campo: marca como visitado e valida
  function aoSair(evento) {
    const { name, value } = evento.target;

    setTocados((anteriores) => ({ ...anteriores, [name]: true }));
    setErros((anteriores) => ({ ...anteriores, [name]: validarCampo(name, value) }));
  }

  // No envio: valida todos os campos, devolve true se estiver tudo certo
  function validarTudo() {
    const campos = Object.keys(valores);
    const novosErros = {};

    campos.forEach((campo) => {
      const mensagem = validarCampo(campo, valores[campo]);
      if (mensagem) {
        novosErros[campo] = mensagem;
      }
    });

    setErros(novosErros);
    setTocados(Object.fromEntries(campos.map((campo) => [campo, true])));

    // Leva o foco ao primeiro campo com erro
    const primeiroComErro = campos.find((campo) => novosErros[campo]);
    if (primeiroComErro) {
      document.getElementById(primeiroComErro)?.focus();
    }

    return !primeiroComErro;
  }

  // Preenche o formulário de uma vez (usado ao carregar um registro para editar)
  const preencher = useCallback((novosValores) => {
    setValores(novosValores);
    setErros({});
    setTocados({});
  }, []);

  // Marca um erro vindo da API num campo específico
  const definirErro = useCallback((campo, mensagem) => {
    setErros((anteriores) => ({ ...anteriores, [campo]: mensagem }));
  }, []);

  return { valores, erros, aoMudar, aoSair, validarTudo, preencher, definirErro };
}
