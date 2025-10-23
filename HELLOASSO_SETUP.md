# Configuration HelloAsso

Ce guide explique comment configurer l'intégration HelloAsso pour gérer les adhésions à l'association.

## Prérequis

1. **Compte HelloAsso** : Créez un compte sur [HelloAsso](https://www.helloasso.com/)
2. **Organisation HelloAsso** : Créez votre organisation/association
3. **Accès à l'API** : Activez l'accès API dans votre compte HelloAsso

## Étapes de configuration

### 1. Obtenir vos identifiants API

1. Connectez-vous à votre compte HelloAsso
2. Allez dans **Paramètres** > **API**
3. Créez une nouvelle application API
4. Notez votre `Client ID` et `Client Secret`

### 2. Récupérer le slug de votre organisation

Le slug est l'identifiant unique de votre organisation dans les URL HelloAsso.
Par exemple, si votre URL est `https://www.helloasso.com/associations/les-patounes`, votre slug est `les-patounes`.

### 3. Configurer les variables d'environnement

Dans le fichier `api/.env`, ajoutez :

```env
# HelloAsso API
HELLOASSO_CLIENT_ID="votre_client_id"
HELLOASSO_CLIENT_SECRET="votre_client_secret"
HELLOASSO_ORGANIZATION_SLUG="les-patounes"

# Frontend URL (pour les redirections)
FRONTEND_URL="http://localhost:5173"
```

### 4. Configurer le montant de l'adhésion

Dans `app/src/pages/Register.jsx`, ligne 106, modifiez le montant :

```javascript
amount: 10, // Montant de l'adhésion en euros
```

## Fonctionnement

### Processus d'adhésion

1. L'utilisateur s'inscrit sur le site
2. Une popup lui propose d'adhérer à l'association
3. S'il accepte, une requête est envoyée au backend
4. Le backend crée un checkout HelloAsso via l'API
5. L'utilisateur est redirigé vers HelloAsso pour payer
6. Après le paiement, il est redirigé vers son profil

### URLs de retour configurées

- **Success** : `/profile?payment=success` - Paiement réussi
- **Error** : `/profile?payment=error` - Erreur de paiement
- **Return** : `/profile?payment=return` - Retour normal

## Endpoints API créés

### POST `/helloasso/create-membership-checkout`

Crée un lien de paiement pour une adhésion.

**Body** :
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "amount": 10
}
```

**Response** :
```json
{
  "redirectUrl": "https://www.helloasso.com/checkout/...",
  "id": "checkout_id"
}
```

### GET `/helloasso/check-payment?checkoutId=xxx`

Vérifie le statut d'un paiement.

**Response** :
```json
{
  "status": "Authorized",
  "order": { ... }
}
```

## Mode Test

HelloAsso propose un mode sandbox pour tester l'intégration sans effectuer de vrais paiements.
Consultez la [documentation HelloAsso](https://api.helloasso.com/v5/documentation) pour plus d'informations.

## Sécurité

- Les clés API ne doivent **JAMAIS** être commit dans le dépôt Git
- Utilisez toujours des variables d'environnement
- Le fichier `.env` est dans `.gitignore`

## Support

En cas de problème :
- Documentation HelloAsso : https://api.helloasso.com/v5/documentation
- Support HelloAsso : support@helloasso.com
