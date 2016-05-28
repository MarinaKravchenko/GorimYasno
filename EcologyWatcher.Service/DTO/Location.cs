using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EcologyWatcher.Service.DTO
{
    public class Location
    {
        [JsonProperty("location")]
        public Coordinates Coords { get; set; }
    }
}