using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace HRMS.Data
{
    public static class InMemoryConfig
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Email(),
                new IdentityResources.Profile()
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("testapis.resource", "Test API")
                {
                    Scopes = {new Scope("testapis") }
                }
            };
        }

        public static IEnumerable<Client> GetClients(IConfiguration configuration)
        {
            var clients = new[]{ new Client
                {
                    AllowAccessTokensViaBrowser = true,
                    ClientId = "t8agr5xKt4$3",
                    ClientName = "Client Test",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = {
                            new Secret("A75A559D-1DAB-4C65-9BC0-F8E590CB388D".Sha256())
                        },
                    AllowedScopes = {
                            "testapis"
                        }
                }
            };

            var spaClientSection = configuration.GetSection("SpaClient");

            if (!spaClientSection.Exists())
            {
                return new Client[] { };
            }

            Client spaClient = spaClientSection.Get<Client>();

            var clients2 =  new[]
            {
                new Client {
                    RequireConsent = false,
                    ClientId =  spaClient.ClientId,
                    ClientName = spaClient.ClientName,
                    // ClientSecrets =
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowedScopes = spaClient.AllowedScopes,
                    RedirectUris = spaClient.RedirectUris,
                    PostLogoutRedirectUris = spaClient.PostLogoutRedirectUris,
                    AllowedCorsOrigins = spaClient.AllowedCorsOrigins,
                    AllowAccessTokensViaBrowser = true,
                    AccessTokenLifetime = 3600
                }
            };

            return  clients2 ;
        }
    }
}
