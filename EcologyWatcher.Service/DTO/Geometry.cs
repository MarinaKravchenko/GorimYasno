using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.DTO
{
    [DataContract]
    public class Geometry
    {
        [DataMember]
        [JsonProperty("geometry")]
        public Location Loc { get; set; }
    }
}