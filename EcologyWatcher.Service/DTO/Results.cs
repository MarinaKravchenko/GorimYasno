using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.DTO
{
    [DataContract]
    public class Results
    {
        [DataMember]
        [JsonProperty("results")]
        public Geometry Geoposition { get; set; }
    }
}