using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace EcologyWatcher.Service.Data
{
    [DataContract]
    public class RelevanceUpdate
    {
        [DataMember]
        public int AccidentId { get; set; }

        [DataMember]
        public int Relevance { get; set; }
    }
}