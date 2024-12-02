﻿using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;

namespace server.Helpers
{
    public static class Extensions
    {
        public static string ToSHA256(this string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }
    }
}
