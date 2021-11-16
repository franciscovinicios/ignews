import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const router = useRouter()

  //Precisamos saber se o usuario ta logado, se ele n tiver login ele n pode fazer uma inscricao;
  const [session] = useSession()

  async function handleSubscribe() {
    // se nao tiver login vamos acionar o metodo pra fazer login
    if (!session) {
      signIn('github')
      return;
    }
 
    if(session?.activeSubscription){
      router.push('/posts')
      return 
    }

    try {
      const response = await api.post('/subscribe')

      // buscar o session id que a gente retornou la no subscribe.ts
      const { sessionId } = response.data

      /* Agora iremos fazer o redirecionamento
      // O stripe tem duas sdk para javascritp, uma para backend(essa que utizamos)
         e uma para o usar no front end direcionado;
         iremos em services e iremos criar um arquivo chamado stripe-js.ts para ligar ao front end
         iremos tbm isntalar o  yarn add @stripe/stripe-js
      */

      const stripe = await getStripeJs()
      // importamos ela aqui

      // e pegamos isso aqui dela passando o id do backend
      // como e nome e igual deixaremos assim mas pode ser ({sessionId }: sessionID)
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      alert(err.message);
    }
  }


  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}