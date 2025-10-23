import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class HelloAssoService {
  private readonly apiUrl = process.env.HELLOASSO_API_URL || 'https://api.helloasso.com/v5';
  private readonly authUrl = process.env.HELLOASSO_AUTH_URL || 'https://api.helloasso.com/oauth2/token';
  private readonly clientId = process.env.HELLOASSO_CLIENT_ID;
  private readonly clientSecret = process.env.HELLOASSO_CLIENT_SECRET;
  private readonly organizationSlug = process.env.HELLOASSO_ORGANIZATION_SLUG;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  /**
   * Obtenir un token d'accès OAuth2 depuis HelloAsso
   */
  private async getAccessToken(): Promise<string> {
    // Si on a déjà un token valide, on le retourne
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        this.authUrl,
        new URLSearchParams({
          client_id: this.clientId || '',
          client_secret: this.clientSecret || '',
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      // Le token expire après le nombre de secondes indiqué, on garde une marge de 60s
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

      return this.accessToken as string;
    } catch (error) {
      console.error('Erreur lors de la récupération du token HelloAsso:', error);
      throw new HttpException(
        'Erreur de connexion à HelloAsso',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Créer un checkout intent pour une adhésion
   */
  async createMembershipCheckout(userData: {
    firstName: string;
    lastName: string;
    email: string;
    amount: number;
  }) {
    const token = await this.getAccessToken();

    try {
      const checkoutData = {
        totalAmount: userData.amount * 100, // Montant en centimes
        initialAmount: userData.amount * 100,
        itemName: 'Adhésion Les Patounes',
        backUrl: `${process.env.FRONTEND_URL}/profile?payment=success`,
        errorUrl: `${process.env.FRONTEND_URL}/profile?payment=error`,
        returnUrl: `${process.env.FRONTEND_URL}/profile?payment=return`,
        containsDonation: false,
        payer: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        },
      };

      const response = await axios.post(
        `${this.apiUrl}/organizations/${this.organizationSlug}/checkout-intents`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        redirectUrl: response.data.redirectUrl,
        id: response.data.id,
      };
    } catch (error) {
      console.error('Erreur lors de la création du checkout HelloAsso:', error.response?.data || error);
      throw new HttpException(
        'Erreur lors de la création du paiement',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Vérifier le statut d'un paiement
   */
  async checkPaymentStatus(checkoutId: string) {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.apiUrl}/organizations/${this.organizationSlug}/checkout-intents/${checkoutId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        status: response.data.state,
        order: response.data.order,
      };
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      throw new HttpException(
        'Erreur lors de la vérification du paiement',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
